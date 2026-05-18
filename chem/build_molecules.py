"""Generate skeletal SVGs for all named molecules used on unit-7-organic-chem.html.

Uses RDKit per chemistry-toolkit skill's "if it has a name and a SMILES, use RDKit" rule.
Produces a single JS file (molecules.js) exporting a MOLECULES object keyed by short name,
so the HTML stays self-contained (no extra HTTP requests).

Run: python3.13 build_molecules.py
"""
from pathlib import Path
from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem.Draw import rdMolDraw2D

# (key, smiles, width, height)
MOLECULES = [
    # Carbon-picker series (alkanes)
    ('methane',  'C',           200, 100),
    ('ethane',   'CC',          240, 100),
    ('propane',  'CCC',         240, 100),
    ('butane',   'CCCC',        260, 100),
    ('pentane',  'CCCCC',       280, 100),
    ('hexane',   'CCCCCC',      300, 100),
    ('heptane',  'CCCCCCC',     320, 100),
    ('octane',   'CCCCCCCC',    340, 100),
    ('nonane',   'CCCCCCCCC',   360, 100),
    ('decane',   'CCCCCCCCCC',  380, 100),

    # Isomers / branched alkanes
    ('isobutane',          'CC(C)C',     220, 140),
    ('2-methylbutane',     'CC(C)CC',    240, 140),
    ('2-methylpentane',    'CC(C)CCC',   260, 140),
    ('2,2-dimethylbutane', 'CC(C)(C)CC', 240, 160),
    ('3-ethyl-2-methylpentane', 'CC(C)C(CC)CC', 320, 180),
    ('2-methylhexane',     'CC(C)CCCC',  300, 140),

    # Carbon classifier (has 1°, 2°, 3°, AND 4° C)
    ('2,2,3-trimethylpentane', 'CCC(C)C(C)(C)C', 320, 180),

    # Cycloalkanes
    ('cyclohexane',                'C1CCCCC1',    220, 200),
    ('methylcyclohexane',          'CC1CCCCC1',   240, 200),
    ('1-ethyl-2-methylcyclohexane','CCC1CCCCC1C', 280, 220),
    ('cyclopropane',               'C1CC1',        180, 160),
    ('cyclopentane',               'C1CCCC1',     200, 200),

    # Alkenes / alkynes
    ('propene',     'C=CC',  240, 100),
    ('propyne',     'C#CC',  240, 100),
    ('but-2-ene',   'CC=CC', 260, 100),
    ('but-1-ene',   'C=CCC', 260, 100),
    ('but-2-yne',   'CC#CC', 260, 100),

    # MEMORIZE branch shortcuts: dummy atom [*] marks the connection point
    ('isopropyl',  '[*]C(C)C',     220, 160),
    ('sec-butyl',  '[*]C(C)CC',    240, 160),
    ('isobutyl',   '[*]CC(C)C',    240, 160),
    ('tert-butyl', '[*]C(C)(C)C',  240, 180),
    ('neopentyl',  '[*]CC(C)(C)C', 260, 180),

    # Additional molecules for the 20-question naming quiz
    ('3-methylpentane',           'CCC(C)CC',         260, 160),
    ('2,3-dimethylbutane',        'CC(C)C(C)C',       240, 160),
    ('3-ethylpentane',            'CCC(CC)CC',        280, 160),
    ('2,4-dimethylpentane',       'CC(C)CC(C)C',      280, 160),
    ('2,2,3-trimethylbutane',     'CC(C)C(C)(C)C',    260, 180),
    ('4-ethyl-2,3-dimethylhexane','CC(C)C(C)C(CC)CC', 340, 200),
    ('3-ethyl-2,2-dimethylpentane','CC(C)(C)C(CC)CC', 320, 200),
    ('1-ethyl-3-methylcyclohexane','CCC1CC(C)CCC1',   260, 220),
    ('4-isopropylheptane',        'CCCC(C(C)C)CCC',   340, 180),
    ('2,2,3,3-tetramethylbutane', 'CC(C)(C)C(C)(C)C', 280, 200),
    ('3-ethyl-3-methylhexane',    'CCC(C)(CC)CCC',    300, 180),

    # Functional groups (Table R) - one example per family
    ('ethene',           'C=C',           220, 100),
    ('chloromethane',    'CCl',           200, 120),
    ('1-chloropropane',  'CCCCl',         260, 140),
    ('bromoethane',      'CCBr',          220, 140),
    ('methanol',         'CO',            200, 120),
    ('ethanol',          'CCO',           220, 120),
    ('dimethyl-ether',   'COC',           220, 120),
    ('ethoxyethane',     'CCOCC',         260, 140),
    ('ethanal',          'CC=O',          220, 120),
    ('propanal',         'CCC=O',         240, 140),
    ('propanone',        'CC(=O)C',       240, 140),
    ('butanone',         'CCC(=O)C',      260, 140),
    ('ethanoic-acid',    'CC(=O)O',       240, 140),
    ('methyl-ethanoate', 'CC(=O)OC',      260, 140),
    ('methylamine',      'CN',            200, 120),
    ('ethylamine',       'CCN',           220, 120),
    ('ethanamide',       'CC(=O)N',       240, 140),
    ('glycine',          'NCC(=O)O',      260, 160),

    # Reaction products / extras
    ('1,2-dibromoethane','BrCCBr',        240, 140),
    ('1,2-dichloroethane','ClCCCl',       240, 140),
    ('sodium-ethanoate', 'CC(=O)[O-].[Na+]', 260, 160),

    # Functional groups practice quiz + transformer
    ('propan-1-ol',      'CCCO',          240, 120),
    ('propan-2-ol',      'CC(O)C',        240, 140),
    ('butan-1-ol',       'CCCCO',         260, 120),
    ('butan-2-ol',       'CCC(O)C',       260, 140),
    ('butan-2-one',      'CCC(=O)C',      260, 140),
    ('propanoic-acid',   'CCC(=O)O',      260, 140),
    ('butanoic-acid',    'CCCC(=O)O',     280, 140),
    ('propyl-ethanoate', 'CC(=O)OCCC',    300, 140),
    ('methyl-propanoate','CCC(=O)OC',     280, 140),
    ('ethyl-ethanoate',  'CC(=O)OCC',     280, 140),
    ('propylamine',      'CCCN',          240, 120),
    ('butan-1-amine',    'CCCCN',         260, 120),
    ('propanamide',      'CCC(=O)N',      260, 140),
    ('2-bromopropane',   'CC(Br)C',       240, 140),
    ('1-bromopropane',   'CCCBr',         260, 140),
    ('2-chlorobutane',   'CCC(Cl)C',      260, 140),
    ('glycerol',         'OCC(O)CO',      240, 180),

    # Animation building blocks
    ('polyethylene-3',   '[*]CCCCCC[*]',  320, 100),
    ('water',            'O',             100, 80),
]


def render_one(smiles: str, w: int, h: int) -> str:
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"Cannot parse SMILES: {smiles!r}")
    AllChem.Compute2DCoords(mol)
    drawer = rdMolDraw2D.MolDraw2DSVG(w, h)
    opts = drawer.drawOptions()
    opts.bondLineWidth = 2.0
    opts.clearBackground = False  # transparent so it sits on the page bg
    opts.padding = 0.10
    drawer.DrawMolecule(mol)
    drawer.FinishDrawing()
    svg = drawer.GetDrawingText()
    # Strip the XML preamble that RDKit emits — we want pure inline SVG
    if svg.startswith("<?xml"):
        svg = svg.split("?>", 1)[1].lstrip()
    return svg


def js_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("$", "\\$")


def main():
    out_dir = Path(__file__).parent
    js_path = out_dir / "molecules.js"
    lines = ["/* Generated by build_molecules.py — do not hand-edit. */",
             "/* RDKit-rendered skeletal SVGs for named molecules. */",
             "window.MOLECULES = {"]
    for key, smiles, w, h in MOLECULES:
        svg = render_one(smiles, w, h)
        lines.append(f"  {key!r}: `{js_escape(svg)}`,")
        # Verify formula matches what we expect (sanity check)
        mol = Chem.MolFromSmiles(smiles)
        from rdkit.Chem import rdMolDescriptors
        formula = rdMolDescriptors.CalcMolFormula(mol)
        print(f"  {key:35s} {smiles:25s} {formula}")
    lines.append("};")
    js_path.write_text("\n".join(lines))
    print(f"\nWrote {len(MOLECULES)} molecule SVGs to {js_path}")
    print(f"File size: {js_path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
